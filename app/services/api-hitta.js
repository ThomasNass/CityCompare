





const getData = async (buisness, city) => {
    try {
        const response = await fetch(`/api/hitta/${buisness}/${city}`,
            {
                method: "GET",
            });
        const data = await response.json();
        if ("error" in data) {//Tvungen att göra på detta sättet då hitta inte verkar kasta ett error
            throw data;
        }
        console.log(data)
        return [data, null];
    }
    catch (error) {
        return [null, error]
    }
}


export async function hitta(buisness, city) {


    let [data, error] = await getData(buisness, city);
    if (error == null) {
        if ("name" in data) {
            data.buisnesses.map((element) => {
                if (buisness == element) {
                    return ["ja", null];
                }
            })
            return ["nej", null]
        }
        else if (data.result.companies.total > 0) {

            return ["ja", null];
        }
        else {

            return ["nej", null];
        }
    }
    else {
        return [null, error]
    }
}








