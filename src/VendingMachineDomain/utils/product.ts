const validProduct1 = {
  name: 'JuiceBox',
  description: 'Orange Juice',
  price: 12.2345,
  quantity: 10
};

const validProduct2 = {
  name: 'Crisps',
  description: 'Potato crisps',
  price: 10.48,
  quantity: 5
};

const invalidProduct = {
  name: '',
  description: 'abc',
  price: -23.45,
  quantity: -4
};

export { validProduct1, validProduct2, invalidProduct };
