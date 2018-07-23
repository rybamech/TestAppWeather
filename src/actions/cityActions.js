export function createCity(city) {
    return {
        type: 'ADD_CITY',
        city: city
    };
}

export function deleteCity(cityId) {
  return {
    type: 'DELETE_CITY',
    cityId: cityId
  };
}
