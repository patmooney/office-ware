exports.submitRequest = function ( data ) {
    fixtures.push( data );
};

var fixtures = [
    { from: '2016-12-26', to: '2016-12-28', type: 'holiday', approved: false },
    { from: '2016-11-12', to: '2016-11-18', type: 'sick', approved: true }
];
exports.fixtures = fixtures;
