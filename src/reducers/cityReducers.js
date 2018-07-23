export default function cityReducer(state = [], action) {
    switch(action.type) {
        case 'ADD_CITY':
        return [...state, Object.assign({}, action.city)];

        case 'DELETE_CITY':
          return [...state].filter((city) => {
            return !(Number(city.id) === Number(action.cityId)) ? 1 : 0;
          });

        default:
        return state;
    }
}
