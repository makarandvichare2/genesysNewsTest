import { NewsTitlePipe } from './news-title.pipe';

describe('NewsTitlePipe', () => {
  let pipe: NewsTitlePipe;

  beforeEach(() => {
    pipe = new NewsTitlePipe();
  });

  it('should create an instance', () => {
    //Act and Assert
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string for null input', () => {
    //Act
    const result = pipe.transform(null, 'https://example.com');

    //Assert
    expect(result).toBe('');
  });

  it('should return an empty string for undefined input', () => {
    //Act
    const result = pipe.transform(undefined, 'https://example.com');

    //Assert
    expect(result).toBe('');
  });

  it('should append the domain from a full URL to the title', () => {
    //Arrange
    const title = 'Sample News Article';
    const fullUrl = 'https://news.ycombinator.com/item?id=30232';
    const expected = 'Sample News Article (https://news.ycombinator.com)';

    //Act
    const result = pipe.transform(title, fullUrl);

    //Assert
    expect(result).toBe(expected);
  });

  it('should append the domain from a base URL to the title', () => {
    //Arrange
    const title = 'Another Article';
    const baseUrl = 'https://www.google.com';
    const expected = 'Another Article (https://www.google.com)';

    //Act
    const result = pipe.transform(title, baseUrl);

    //Assert
    expect(result).toBe(expected);
  });

  it('should return the original title if no URL is provided', () => {
    //Arrange
    const title = 'Title Without a URL';
    const expected = 'Title Without a URL';

    //Act
    const result = pipe.transform(title, '');

    //Assert
    expect(result).toBe(expected);
  });

  it('should not append the domain from a base URL to the title', () => {
    //Arrange
    const title = 'Sample News Article';
    const fullUrl = 'https://';
    const expected = 'Sample News Article';

    //Act
    const result = pipe.transform(title, fullUrl);

    //Assert
    expect(result).toBe(expected);
  });
});
