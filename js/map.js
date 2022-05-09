import { createOffer } from './offer.js';
import { mapFiltersForm, setMapFilters, filterOffers } from './filters.js';
import { adForm } from './form-validation.js';
import { getData, showError } from './api.js';
import { debounce } from './debounce.js';

const MAIN_PIN_SIZE = 52;
const AD_PIN_SIZE = 40;
const BASIC_LAT = 35.68948;
const BASIC_LNG = 139.69170;
const BASIC_MAP_SCALING = 13;
const DECIMAL_PLACE = 5;
const OFFERS_COUNT = 10;
const map = L.map('map-canvas');
const adress = document.querySelector('#address');

const toggleClass = (element, className, value) => {
  element.classList.toggle(className, value);
};

const toggleFormElements = (formElements, value) => {
  formElements.forEach((element) => {element.disabled = value;});
};

const toggleAdForm = (value) => {
  toggleClass(adForm, 'ad-form--disabled', value);
  toggleFormElements(adForm.querySelectorAll('fieldset'), value);
};

const toggleFiltersForm = (value) => {
  toggleClass(mapFiltersForm, 'map__filters--disabled', value);
  toggleFormElements(mapFiltersForm.querySelectorAll('select, .map__features'), value);
};

const toggleForms = (value) => {
  toggleAdForm(value);
  toggleFiltersForm(value);
};

const mainPinMarker = L.icon({
  iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999"%3E%3Cdefs/%3E%3Cpath fill="%23ef1616" d="M255.999 0C152.786 0 68.817 85.478 68.817 190.545c0 58.77 29.724 130.103 88.349 212.017 42.902 59.948 85.178 102.702 86.957 104.494 3.27 3.292 7.572 4.943 11.879 4.943 4.182 0 8.367-1.558 11.611-4.683 1.783-1.717 44.166-42.74 87.149-101.86 58.672-80.701 88.421-153.007 88.421-214.912C443.181 85.478 359.21 0 255.999 0zm0 272.806c-50.46 0-91.511-41.052-91.511-91.511s41.052-91.511 91.511-91.511 91.511 41.052 91.511 91.511-41.053 91.511-91.511 91.511z"/%3E%3C/svg%3E%0A',
  iconSize: [MAIN_PIN_SIZE, MAIN_PIN_SIZE],
  iconAnchor: [MAIN_PIN_SIZE/2, MAIN_PIN_SIZE],
});

const adPin = L.icon({
  iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999"%3E%3Cdefs/%3E%3Cpath fill="%231975c8" d="M255.999 0C152.786 0 68.817 85.478 68.817 190.545c0 58.77 29.724 130.103 88.349 212.017 42.902 59.948 85.178 102.702 86.957 104.494 3.27 3.292 7.572 4.943 11.879 4.943 4.182 0 8.367-1.558 11.611-4.683 1.783-1.717 44.166-42.74 87.149-101.86 58.672-80.701 88.421-153.007 88.421-214.912C443.181 85.478 359.21 0 255.999 0zm0 272.806c-50.46 0-91.511-41.052-91.511-91.511s41.052-91.511 91.511-91.511 91.511 41.052 91.511 91.511-41.053 91.511-91.511 91.511z"/%3E%3C/svg%3E%0A',
  iconSize: [AD_PIN_SIZE, AD_PIN_SIZE],
  iconAnchor: [AD_PIN_SIZE/2, AD_PIN_SIZE],
});

const marker = L.marker(
  {
    lat: BASIC_LAT,
    lng: BASIC_LNG,
  },
  {
    draggable: true,
    icon: mainPinMarker,
  },
);

const markerGroup = L.layerGroup().addTo(map);

const createMarker = (point) => {
  const {location} = point;
  const adMarker = L.marker(
    {
      lat: location.lat,
      lng: location.lng,
    },
    {
      icon: adPin,
    },
  );
  adMarker
    .addTo(markerGroup)
    .bindPopup(createOffer(point));
};

const renderMarkers = (offers) => {
  offers
    .slice()
    .slice(0, OFFERS_COUNT)
    .forEach((point) => createMarker(point));
};

const loadMap = () => {
  map.on('load', () => {
    getData((offers) => {
      setMapFilters(debounce(
        () => renderMarkers(filterOffers(offers)),
      ));
      renderMarkers(offers);
      toggleForms(false);
    }, () => showError('Не удалось получить данные. Попробуйте ещё раз'));
  })
    .setView({
      lat: BASIC_LAT,
      lng: BASIC_LNG,
    }, BASIC_MAP_SCALING);
};

const resetMap = () => map.setView({
  lat: BASIC_LAT,
  lng: BASIC_LNG,
});

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const resetMarker = () => {
  marker.setLatLng({
    lat: BASIC_LAT,
    lng: BASIC_LNG,
  });
};

marker.addTo(map);

marker.on('drag', (evt) => {
  const coordinates = evt.target.getLatLng();
  adress.value = `${coordinates.lat.toFixed(DECIMAL_PLACE)}, ${coordinates.lng.toFixed(DECIMAL_PLACE)}`;
});

export { loadMap, resetMap, adForm, resetMarker, markerGroup, renderMarkers, toggleForms, toggleFiltersForm };
