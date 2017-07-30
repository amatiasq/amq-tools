import chunks from '../../src/util/chunks';


describe('`chunks` helper', () => {
  it('should return an empty array if given array is empty');
  it('should return a single-element array if the given array length is smaller than the required chunk size');

  [{
    input: [1,2,3,4,5],
    length: 2,
    output: [[1,2],[3,4],[5]],
  }, {
    input: [1,2,3,4,5],
    length: 3,
    output: [[1,2,3],[4,5]],
  }, {
    input: [1,2,3,4,5,6],
    length: 3,
    output: [[1,2,4],[4,5,6]],
  }, {
    input: [1],
    length: 2,
    output: [[1,2],[3,4],[5]],
  }].forEach(({input, output, length}) => test(input, length, output));
});


function test(input, length, output) {
  it(`should return ${JSON.stringify(output)} when ${JSON.stringify(input)} is passed with ${length} as length`);
}