import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import * as cityActions from '../../actions/cityActions';
import {CITIES} from "../../data/cities";
import * as axios from 'axios';
import {fahrenheitToCelsium} from "../../services/adapters";


class citysPage extends React.Component {

  componentDidMount() {
    this.getWeatherByPosition();
    if(JSON.parse(window.localStorage.getItem('activeCitiesList').length)) {
      for(const city of JSON.parse(window.localStorage.getItem('activeCitiesList'))) {
        this.props.dispatch(cityActions.createCity(city));

      }
    }
  }

  constructor(props, context) {
    super(props, context);
    const cuttedCitiesList = [];
    this.state = {
      city: {
        title: null,
      },
      autocompleteCitiesList: [],
      selectedCityId: null,
      weatherData: null,
      weatherShowMode: 'celsium'

    };

    this.onTitleChange = this.onTitleChange.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.cityRow = this.cityRow.bind(this);
    this.addCity = this.addCity.bind(this);
    this.showCityWeather = this.showCityWeather.bind(this);
    this.deleteCityById = this.deleteCityById.bind(this);
    this.weatherMode = this.weatherMode.bind(this);
    this.toggleWeatherMode = this.toggleWeatherMode.bind(this);
    this.convertedTemp = this.convertedTemp.bind(this);
    this.getWeatherByPosition = this.getWeatherByPosition.bind(this);
  }

  onTitleChange(event) {
    const city = this.state.city;
    const filteredCities = CITIES
      .filter((city) => new RegExp(event.target.value.toLowerCase()).test(city.name.toLowerCase()) ? 1 : 0);
    city.title = event.target.value;
    console.log(event.target.value);
    this.setState({city: city, autocompleteCitiesList: filteredCities});
  }

  onClickSave() {
    this.props.dispatch(cityActions.createCity(this.state.city));
  }

  cityRow(city, index) {
    return <div key={index}>{city.title}</div>;
  }

  addCity(city) {
    this.props.dispatch(cityActions.createCity(city));
    window.localStorage.setItem('activeCitiesList', JSON.stringify(this.props.activeCitys.concat([city])));
  }

  showCityWeather(event) {
    event.persist();
    let weatherData = {};
    axios.get('https://api.openweathermap.org/data/2.5/weather?id='
      + event.target.id +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial")
      .then((response) => {
        weatherData = response.data;
        console.log(weatherData);
        this.setState({
          selectedCityId: event.target.id,
          weatherData: weatherData
        })
      });

  }

  getWeatherByPosition() {
    let latitude = 0;
    let longitude = 0;
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial`)
        .then((response) => {
          const weatherData = response.data;
          console.log(weatherData);
          this.setState({
            selectedCityId: event.target.id,
            weatherData: weatherData
          })
        });
    });
  }

  deleteCityById() {
    const updatedActiveCities = this.props.activeCitys.filter((city) => {
      return !(Number(city.id) === Number(this.state.selectedCityId)) ? 1 : 0;
    });
    this.props.dispatch(cityActions.deleteCity(this.state.selectedCityId));
    window.localStorage.setItem('activeCitiesList', JSON.stringify(updatedActiveCities));
  }

  weatherMode() {
    const mode = this.state.weatherShowMode;
    return mode === 'celsium' ? '°C' : '°F';
  };

  toggleWeatherMode() {
    this.setState({
      weatherShowMode: this.state.weatherShowMode === 'celsium' ? 'fahrenheit' : 'celsium'
    })
  }

  convertedTemp(value) {
    if(this.weatherMode() === '°C') {
      return fahrenheitToCelsium(value);
    } else {
      return value;
    }
  }

  render() {
    const styleObj = {textalign: "center"};

    return (
      <div>
        <h1>Weather App</h1>
        <button className="btn btn-success" onClick={this.toggleWeatherMode}>{this.weatherMode()}</button>
        {this.props.activeCitys.map(this.cityRow)}
        <h2>Выбрать город</h2>
        <form>
          <div className="row">
            <div className="col-xs-5">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search&hellip;"
                       onChange={this.onTitleChange}
                       value={this.state.city.title}/>
                <span className="input-group-btn">
                    <button type="button" className="btn btn-default" onClick={this.onClickSave}>Добавить город</button>
                </span>
              </div>
            </div>
          </div>
        </form>
        <div>
          {this.state.autocompleteCitiesList.map((city) => {
            return (
              <div style={{cursor: 'pointer'}}  key={city.id} className="alert alert-success" role="alert" onClick={function (event) {
                return this.addCity(city);
              }.bind(this)}>
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span>id: {city.id}</span>
                ---City name is: {city.name}
              </div>
            )
          })}
        </div>
        <div className="panel panel-default">
          <div className="panel-body">
            Список городов
            <div>
              <ul className="list-group">
                {this.props.activeCitys.map((city) => {
                  return (
                    <li style={{cursor: 'pointer'}} key={city.id} id={city.id} className={`list-group-item
                      ${(Number(city.id) === Number(this.state.selectedCityId)) ? ' active' : '' }
                    `}
                        onClick={this.showCityWeather}>{city.name}</li>
                  )
                })}
              </ul>
              <button onClick={this.deleteCityById} disabled={!this.props.activeCitys.length} className="btn btn-danger">Удалить выбранный город</button>

            </div>
          </div>
          <div style={styleObj}>
            <h2>Погода в городе {this.state.weatherData && this.state.weatherData.name}</h2>
            <p>Текущая
              температура: {
            (this.state.weatherData && this.state.weatherData.main)
              ?
              this.convertedTemp(this.state.weatherData.main.temp) : 'Неизвестно'
          }</p>
            <p>Скорость
              ветра: {(this.state.weatherData && this.state.weatherData.wind) ? `${this.state.weatherData.wind.speed} m/c` : 'Неизвестно'}</p>
            <p>Влажность: {(this.state.weatherData && this.state.weatherData.main) ? `${this.state.weatherData.main.humidity} %` : 'Неизвестно'}</p>
            <p>Давление: {(this.state.weatherData && this.state.weatherData.main) ? `${this.state.weatherData.main.pressure} mm` : 'Неизвестно'}</p>
            <p>Координаты: Долгота {
            (this.state.weatherData && this.state.weatherData.coord) ? `${this.state.weatherData.coord.lon}` : 'Неизвестно'
          } - Широта {
              (this.state.weatherData && this.state.weatherData.coord) ? `${this.state.weatherData.coord.lat }` : 'Неизвестно'
            }</p>
          </div>
        </div>
      </div>
    );
  }
}

citysPage.PropTypes = {
  dispatch: PropTypes.func.isRequired,
  citys: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    activeCitys: state.citys
  };
}

export default connect(mapStateToProps)(citysPage);
