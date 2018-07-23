import delay from './delay';

// This file mocks a web API by working with the hard-coded data below.
// It uses setTimeout to simulate the delay of an AJAX call.
// All calls return promises.
const citys = [
  {
    id: "react-flux-building-applications",
    title: "Building Applications in React and Flux",
    watchHref: "http://www.pluralsight.com/citys/react-flux-building-applications",
    authorId: "cory-house",
    length: "5:08",
    category: "JavaScript"
  },
  {
    id: "clean-code",
    title: "Clean Code: Writing Code for Humans",
    watchHref: "http://www.pluralsight.com/citys/writing-clean-code-humans",
    authorId: "cory-house",
    length: "3:10",
    category: "Software Practices"
  },
  {
    id: "architecture",
    title: "Architecting Applications for the Real World",
    watchHref: "http://www.pluralsight.com/citys/architecting-applications-dotnet",
    authorId: "cory-house",
    length: "2:52",
    category: "Software Architecture"
  },
  {
    id: "career-reboot-for-developer-mind",
    title: "Becoming an Outlier: Reprogramming the Developer Mind",
    watchHref: "http://www.pluralsight.com/citys/career-reboot-for-developer-mind",
    authorId: "cory-house",
    length: "2:30",
    category: "Career"
  },
  {
    id: "web-components-shadow-dom",
    title: "Web Component Fundamentals",
    watchHref: "http://www.pluralsight.com/citys/web-components-shadow-dom",
    authorId: "cory-house",
    length: "5:10",
    category: "HTML5"
  }
];

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

//This would be performed on the server in a real app. Just stubbing in.
const generateId = (city) => {
  return replaceAll(city.title, ' ', '-');
};

class cityApi {
  static getAllcitys() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(Object.assign([], citys));
      }, delay);
    });
  }

  static savecity(city) {
    city = Object.assign({}, city); // to avoid manipulating object passed in.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate server-side validation
        const mincityTitleLength = 1;
        if (city.title.length < mincityTitleLength) {
          reject(`Title must be at least ${mincityTitleLength} characters.`);
        }

        if (city.id) {
          const existingcityIndex = citys.findIndex(a => a.id == city.id);
          citys.splice(existingcityIndex, 1, city);
        } else {
          //Just simulating creation here.
          //The server would generate ids and watchHref's for new citys in a real app.
          //Cloning so copy returned is passed by value rather than by reference.
          city.id = generateId(city);
          city.watchHref = `http://www.pluralsight.com/citys/${city.id}`;
          citys.push(city);
        }

        resolve(city);
      }, delay);
    });
  }

  static deletecity(cityId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const indexOfcityToDelete = citys.findIndex(city => {
          city.id == cityId;
        });
        citys.splice(indexOfcityToDelete, 1);
        resolve();
      }, delay);
    });
  }
}

export default cityApi;
