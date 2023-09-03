import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { set, reset } from "mockdate"

type EventStatus = { status: string }

class CheckLastEventStatus {
    private LoadLastEventRepository: LoadLastEventRepository

    constructor(loadLastEventRepository: LoadLastEventRepository) {
        this.LoadLastEventRepository = loadLastEventRepository
    }

    async perfom({ groupId }: { groupId: string }): Promise<EventStatus> {
        const event = await this.LoadLastEventRepository.loadLastEvent({ groupId })
        const now = new Date(new Date().getDate())


        if (event === undefined) {
            return { status: 'done' }
        } 
        
        return event.endDate < now? { status: "inReview"} : {status: "active"}
    }

} // caso de uso

interface LoadLastEventRepository {
    loadLastEvent: (input: { groupId: string }) => Promise<{ endDate: Date } | undefined> //contrato assincron porque tem uma PROMISE/assinatura

} // ligação com o gateways


class LoadLastEventRepositorySpy implements LoadLastEventRepository {
    groupId?: string;
    callsCount = 0
    output?: { endDate: Date }

    async loadLastEvent({ groupId }: { groupId: string }): Promise<{ endDate: Date } | undefined> {
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

        loadLastEventRepository.output = {
            endDate: new Date(new Date().getDate() + 1)
        }

        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("active")
    })

    it('should return status inReview when now is after event end time', async () => {
        const { sut, loadLastEventRepository } = MakeSut()
        loadLastEventRepository.output = {
            endDate: new Date(new Date().getDate() - 1)
        }

        const eventStatus = await sut.perfom({ groupId })

        expect(eventStatus.status).toBe("inReview")


    })

})

