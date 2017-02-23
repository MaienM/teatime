import _ from 'lodash';
import uuidV4 from 'uuid/v4';
import lorem from 'lorem-ipsum';

function noConflict(list, generator, ...args) {
	let value;
	do {
		value = generator(...args);
	} while(_.includes(list, value));
	return value;
}

function generateName() {
	return lorem({
		sentenceLowerBound: 1,
		sentenceUpperBound: 5
	}).replace('.', '');
}

function maybeRange(number, deviations) {
	return (_.random(3) == 0) ?
		[number + deviations[0], number + deviations[1]] :
		[number, number];
}

// Generate brands
const brands = [];
_.times(100, () => {
	brands.push({
		uuid: noConflict(_.map(brands, 'uuid'), uuidV4),
		name: noConflict(_.map(brands, 'name'), generateName),
	});
});

// Generate categories
const categories = [];
_.times(100, () => {
	categories.push({
		uuid: noConflict(_.map(categories, 'uuid'), uuidV4),
		name: noConflict(_.map(categories, 'name'), generateName),
	});
});

// Generate teas
const teas = [];
_(_.zip(
	_(brands).map((b) => _.times(_.random(1, 10), _.constant(b.uuid))).flatten().shuffle().value(),
	_(categories).map((c) => _.times(_.random(1, 10), _.constant(c.uuid))).flatten().shuffle().value(),
)).filter((t) => t[0] && t[1]).each(([brand_uuid, category_uuid]) => {
	teas.push({
		uuid: noConflict(_.map(teas, 'uuid'), uuidV4),
		name: noConflict(_.map(teas, 'name'), generateName),
		brand_uuid,
		category_uuid,
	});
});

// Generate prices
const prices = [];
_(teas).map('uuid').each((tea_uuid) => {
	_.times(_.random(1, 3), (i) => {
		prices.push({
			uuid: noConflict(_.map(prices, 'uuid'), uuidV4),
			price: (i == 0 ?
				_.random(100, 1000) * 0.05 :
				_.round(_.last(prices).price * 1.9, 0)
			),
			amount: (i == 0 ?
				_.random(1, 10) * 50 :
				_.last(prices).amount * 2
			),
			tea_uuid,
		});
	});
});

// Generate steep advices
const steep_advices = [];
_(teas).map('uuid').each((tea_uuid) => {
	_.times(_.random(1, 3), (i) => {
		steep_advices.push({
			uuid: noConflict(_.map(steep_advices, 'uuid'), uuidV4),
			name: ['Official', 'Personal', 'Steepster'][i],
			description: _.random(10) == 0 ? lorem({ count: 3 }) : null,
			amount: maybeRange(_.round(_.random(0.2, 4), 1), [0, _.round(_.random(0.1, 0.5), 1)]),
			duration: maybeRange(_.random(1, 30) * 10, [0, _.random(1, 5) * 10]),
			temperature: maybeRange(_.random(10, 20) * 5, [_.random(-5, -1) * 5, _.random(1, 5) * 5]), 
			tea_uuid,
		});
	});
});

// Generate the SQL
_.each({ brands, categories, teas, prices, steep_advices }, (items, table) => {
	let keys = _.keys(_.first(items)).join(',');
	let values = _.map(items, (item) => (
		'(' + _.map(_.values(item), (v) => {
			if (typeof(v) == 'string') {
				return "'" + v + "'";
			} else if (typeof(v) == 'object' && v) {
				return "'" + JSON.stringify(v) + "'";
			} else {
				return JSON.stringify(v);
			}
		}).join(',') + ')'
	)).join(',');
	console.log('INSERT INTO "' + table + '" (' + keys + ') VALUES ' + values + ';');
});
