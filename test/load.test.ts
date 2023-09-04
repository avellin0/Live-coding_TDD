import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { set, reset } from "mockdate"

class EventStatus {
    status: 'active' | 'inReview' | 'done'

    constructor(event?: { endDate: Date, ReviewDurationInHours: number }) {
        const now = new Date(new Date().getDate())
        if (event === undefined) {
            this.status = 'done'
            return
        }

        if (event.endDate >= now) {
            this.status = 'active'
            return
        }

        const ReviewDurationInHours = 1
        const ReviewDurationInMs = ReviewDurationInHours * 60 * 60 * 1000
        const ReviewDate = new Date(event.endDate.getTime() + ReviewDurationInMs)


        this.status = ReviewDate >= now ? 'inReview' : 'done'
    }
}//Não deixe os IFs nos casos de uso

class CheckLastEventStatus {
    private LoadLastEventRepository: LoadLastEventRepository

    constructor(loadLastEventRepository: LoadLastEventRepository) {
        this.LoadLastEventRepository = loadLastEventRepository
    }

    async perfom({ groupId }: { groupId: string }): Promise<EventStatus> {
        const event = await this.LoadLastEventRepository.loadLastEvent({ groupId })
        return new EventStatus(event)
    }

} // caso de uso


interface LoadLastEventRepository {
    loadLastEvent: (input: { groupId: string }) => Promise<{ endDate: Date, ReviewDurationInHours: number } | undefined> //contrato assincron porque tem uma PROMISE/assinatura

} // ligação com o gateways


class LoadLastEventRepositorySpy implements LoadLastEventRepository {
    groupId?: string;
    callsCount = 0
    ReviewDurationInHours?: Date
    output?: { endDate: Date, ReviewDurationInHours: number }


    SetEndDateAfterNow(): void {
        this.output = {
            endDate: new Date(new Date().getDate() + 1),
            ReviewDurationInHours: 1
        }
    }

    SetEndDateEqualToNow(): void {
        this.output = {
            endDate: new Date(),
            ReviewDurationInHours: 1
        }

    }

    SetEndDateBeforeNow(): void {
        this.output = {
            endDate: new Date(new Date().getDate() - 1),
            ReviewDurationInHours: 1
        }

    }


    async loadLastEvent({ groupId }: { groupId: string }): Promise<{ endDate: Date, ReviewDurationInHours: number } | undefined> {
        this.groupId = groupId
        this.callsCount++
        return this.output
    }

} //gateway 


//factory
type SutOutput = { sut: CheckLastEventStatus, loadLastEventRepository: LoadLastEventRepositorySpy }


const MakeSut = (): SutOutput => {
    const loadLastEventRepository = new LoadLastEventRepositorySpy()
    const sut = new CheckLastEventStatus(loadLastEventRepository)
    return { sut, loadLastEventRepository }
}


const groupId = "any_group_id"


describe('CheckLastEventStatus', () => {
    beforeAll(() => {
        set(new Date())
    })

    afterAll(() => {
        reset()
    })

    it('should get last event data', async () => {
        const { sut, loadLastEventRepository } = MakeSut()

        await sut.perfom({ groupId: groupId })

        expect(loadLastEventRepository.groupId).toBe(groupId)
        expect(loadLastEventRepository.callsCount).toBe(1)
    })

    it('should return status done when has no event', async () => {
        const { sut, loadLastEventRepository } = MakeSut()
        loadLastEventRepository.output = undefined

        const eventStatus = await sut.perfom({ groupId: groupId })

        expect(eventStatus.status).toBe(eventStatus.status)


    })

    it('should return status active when now is before event end time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()
        loadLastEventRepository.SetEndDateAfterNow()
        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("active")
    })

    it('should return status active when now is equal to event end time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()
        loadLastEventRepository.SetEndDateEqualToNow()
        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("active")
    })

    it('should return status inReview when now is after event end time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()
        loadLastEventRepository.SetEndDateBeforeNow()
        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("inReview")


    })

    it('should return status inReview when now is before Review time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()

        const ReviewDurationInHours = 1
        const ReviewDurationInMs = ReviewDurationInHours * 60 * 60 * 1000

        loadLastEventRepository.output = {
            endDate: new Date(new Date().getDate() - ReviewDurationInMs + 1),
            ReviewDurationInHours

        }
        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("inReview")


    })

    it('should return status inReview when now is equal to Review time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()

        const ReviewDurationInHours = 1
        const ReviewDurationInMs = ReviewDurationInHours * 60 * 60 * 1000

        loadLastEventRepository.output = {
            endDate: new Date(new Date().getDate() - ReviewDurationInMs),
            ReviewDurationInHours

        }
        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("inReview")


    })

    it('should return status done when now is after Review time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()

        const ReviewDurationInHours = 1
        const ReviewDurationInMs = ReviewDurationInHours * 60 * 60 * 1000

        loadLastEventRepository.output = {
            endDate: new Date(new Date().getDate() - ReviewDurationInMs - 1),
            ReviewDurationInHours

        }
        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("done")


    })
})

