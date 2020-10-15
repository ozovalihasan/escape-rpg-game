import 'regenerator-runtime';

const OperationsAPI = () => {
  async function update(user, score, gameId = 'i25LxmJPmkS0pEceLraW') {
    return fetch(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          user,
          score,
        }),
      },
    );
  }

  async function getScores(gameId = 'i25LxmJPmkS0pEceLraW') {
    const scores = await fetch(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores`,
      {
        method: 'GET',
        mode: 'cors',
      },
    );
    const results = await scores.json();
    return results;
  }
  return { update, getScores };
};
export default OperationsAPI();
