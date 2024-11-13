/**
 * Fetches a list of random users from the API.
 *
 * @async
 * @function fetchRandomUsers
 * @param {number} [page=1] - The page number to fetch, defaults to 1.
 * @returns {Promise<Array<RandomUsersResponse> | undefined>} A promise that resolves to an array of random user data or `undefined` if an error occurs.
 * @throws Will throw an error if the network request fails.
 */
export async function fetchRandomUsers(page:number = 1): Promise<Array<RandomUsersResponse> | undefined> {
  try {
    const response = await fetch(
      `/api/?page=${page}&results=20&seed=abc&inc=name,email,phone,picture`,
    );

    // checking if we can handle the request
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // parse the JSON response
    const parsedResponse = await response.json();
    return parsedResponse.results;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

/** Fetch api response to a request */
export interface RandomUsersResponse {
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}
