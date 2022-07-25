const validProduct1 = {
  name: 'JuiceBox',
  description: 'Orange Juice',
  price: 2.2345,
  quantity: 2
};

const validProduct2 = {
  name: 'Crisps',
  description: 'Potato crisps',
  price: 13,
  quantity: 3
};

const invalidProduct = {
  name: '',
  description: 'abc',
  price: -243.45,
  quantity: -40
};

export { validProduct1, validProduct2, invalidProduct };
