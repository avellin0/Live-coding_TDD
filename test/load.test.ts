import { describe, it, expect, } from "vitest"

class CheckLastEventStatus {
    private LoadLastEventRepository: LoadLastEventRepository

    constructor(loadLastEventRepository: LoadLastEventRepository) {
        this.LoadLastEventRepository = loadLastEventRepository
    }

    async perfom(groupId: string): Promise<void> {
       await this.LoadLastEventRepository.loadLastEvent(groupId)
    }

} // caso de uso

interface LoadLastEventRepository {
    loadLastEvent: (groupId: string) => Promise<void> //contrato assincrono porque tem uma PROMISE

} // ligação com o gateways



class LoadLastEventRepositoryMock implements LoadLastEventRepository {
    groupId?: string;

    async loadLastEvent (groupId: string): Promise<void> {
    this.groupId = groupId
    }

} //gateway 

describe('CheckLastEventStatus', () => {
    it('should get last event data', async () => {

        const loadLastEventRepository = new LoadLastEventRepositoryMock()
        const checkLastEventStatus = new CheckLastEventStatus(loadLastEventRepository)

        await checkLastEventStatus.perfom("any_group_id")

        expect(loadLastEventRepository.groupId).toBe("any_group_id")
    })
})