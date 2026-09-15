import axios from "axios";

export async function getJobListings(cityName) {
  try {
    const response = await axios.get(
      `https://links.api.jobtechdev.se/joblinks?q=${cityName}&limit=100`
    );
    return [response.data, null];
  } catch (err) {
    return [null, err];
  }
}

export async function getJobListingsByField(occupations, cityName) {
  const response = await axios.get(
    `https://links.api.jobtechdev.se/joblinks?municipality=${cityName}&occupation-field=${occupations}&limit=100`
  );
  return response.data;
}
