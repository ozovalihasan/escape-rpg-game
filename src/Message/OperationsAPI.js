import 'regenerator-runtime';

const OperationsAPI = ()=> {
  async function update(user, score) {
     fetch(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/y8GzlRyYicJoOjaUW5fV/scores`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          score,
        }),
      },
    );
  }

  }

  async function getScores() {
    const scores = await fetch(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/y8GzlRyYicJoOjaUW5fV/scores`,
      {
        method: 'GET',
        mode: 'cors',
      }
    )
    const results = await scores.json();
    return results;
      // .then((scores) => {return scores.json()})

      // .then((result) => {
      //   // console.log(result)
      //   return result;
      // });
  }
  return { update, getScores };
}
export default OperationsAPI();