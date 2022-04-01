import { markerGroup } from './map.js';

const mapFiltersForm = document.querySelector('.map__filters');
const livingTypeInput = document.querySelector('#housing-type');
const priceInput = document.querySelector('#housing-price');
const roomsInput = document.querySelector('#housing-rooms');
const guestsInput = document.querySelector('#housing-guests');
const pricesByValues = {
  'low': [0, 10000],
  'high': [50000, 100000],
  'middle': [10000, 50000],
  'any': [0, 100000],
};

const setMapFilters = (cb) => {
  mapFiltersForm.addEventListener('change', () => {
    markerGroup.clearLayers();
    cb();
  });
};

const filterByLivingType = ({offer}) => {
  if (livingTypeInput.value === 'any') {
    return offer;
  }
  if (offer.type === livingTypeInput.value) {
    return offer;
  }
};

const filterByPrice = ({offer}) => offer.price >= pricesByValues[priceInput.value][0] && offer.price <= pricesByValues[priceInput.value][1];

const filterByRooms = ({offer}) => (roomsInput.value === 'any') ? offer : Number(roomsInput.value);

const filterByGuests = ({offer}) => (guestsInput.value === 'any') ? offer : Number(guestsInput.value);

const isEqualArrays = (a, b) => a.length === b.length && a.every((val, index) => val === b[index]);

const filterByFeatures = ({offer}) => {
  let elementFeatures = [];
  const checkedFilters = document.querySelector('.map__features').querySelectorAll('input:checked');
  if (checkedFilters.length === 0) {
    return offer;
  }
  if (offer.features !== undefined) {
    elementFeatures = offer.features;
    const filtersFeatures = [];
    checkedFilters.forEach((el) => filtersFeatures.push(el.value));
    return isEqualArrays(elementFeatures.sort(), filtersFeatures.sort());
  }
};

const filterOffers = (offers) => offers.filter((offer) => filterByLivingType(offer))
  .filter((offer) => filterByPrice(offer))
  .filter((offer) => filterByRooms(offer))
  .filter((offer) => filterByGuests(offer))
  .filter((offer) => filterByFeatures(offer));

export { setMapFilters ,filterOffers };
