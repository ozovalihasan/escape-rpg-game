import OperationsAPI from '../../Message/OperationsAPI';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
    fetchMock.enableMocks()
});

describe('API',  () => {
  test('feature to update API', async () => {
    const result =    await OperationsAPI.update() 
    expect(result.status).toBe(200);
  });
  test('feature to get score from API', async () => {
    fetchMock.mockOnce(JSON.stringify([{score: 100, username: "test"}]))

    const result =    await OperationsAPI.getScores() 
    expect(result[0].score).toBe(100);
    expect(result[0].username).toBe('test');
  });
});
