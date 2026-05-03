class MockProvider {
    async createCharge(details) {
        console.log("Mock charge created:", details);
        return { id: 'mock_' + Date.now(), status: 'pending' };
    }
    async getCharge(id) {
        return { id, status: 'completed' };
    }
}

module.exports = new MockProvider();
