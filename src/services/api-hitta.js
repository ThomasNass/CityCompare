async function getData(buisness, city) {
  try {
    const response = await fetch(`/api/hitta/${buisness}/${city}`, {
      method: "GET",
    });
    const data = await response.json();
    if ("error" in data) {
      throw data;
    }
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

export async function hitta(buisness, city) {
  const [data, error] = await getData(buisness, city);
  if (error != null) {
    return [null, error];
  }

  if ("name" in data) {
    if (Array.isArray(data.buisnesses) && data.buisnesses.includes(buisness)) {
      return ["ja", null];
    }
    return ["nej", null];
  }

  if (data.result?.companies?.total > 0) {
    return ["ja", null];
  }

  return ["nej", null];
}
