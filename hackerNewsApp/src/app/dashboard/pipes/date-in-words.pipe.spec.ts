import { DateInWordsPipe } from './date-in-words.pipe';
import moment from 'moment';
jest.spyOn(moment.fn, 'fromNow').mockImplementation(() => 'a few seconds ago');
describe('DateInWordsPipe', () => {
  let pipe: DateInWordsPipe;

  beforeEach(() => {
    pipe = new DateInWordsPipe();
  });

  it('should create an instance', () => {
    //Act & Assert
    expect(pipe).toBeTruthy();
  });

  it('should transform a valid timestamp to a human-readable string', () => {
    //Arrange
    // The input is a timestamp in seconds. The pipe multiplies it by 1000.
    const mockTimestampInSeconds = 1672531200; // Represents Jan 1, 2023, 12:00:00 AM UTC

    //Act
    const result = pipe.transform(mockTimestampInSeconds);

    //Assert
    expect(result).toBe('a few seconds ago');
  });

  it('should return an empty string for null input', () => {
    //Arrange
    const result = pipe.transform(null);

    //Assert
    expect(result).toBe('');
  });

  it('should return an empty string for undefined input', () => {
    //Arrange
    const result = pipe.transform(undefined);

    //Assert
    expect(result).toBe('');
  });

});
