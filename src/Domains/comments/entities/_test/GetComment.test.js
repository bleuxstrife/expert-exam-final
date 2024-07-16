const GetComment = require('../GetComment');

describe('a GetComment entites', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Get Comment',
      username: 'renorizky',
      date: '2024-07-04T12:26:21.338Z',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 123,
      date: 1234,
      username: 'renorizky',
      is_delete: true,
      likeCount: '12',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should get deleted comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'Get Comment',
      date: '2024-07-04T12:26:21.338Z',
      username: 'renorizky',
      is_delete: true,
      replies: [],
      likeCount: 0,
    };

    const deletedContent = '**komentar telah dihapus**';

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.content).toEqual(deletedContent);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.replies).toEqual([]);
    expect(getComment.likeCount).toEqual(0);
  });

  it('should get comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'Get Comment',
      date: '2024-07-04T12:26:21.338Z',
      username: 'renorizky',
      is_delete: false,
      likeCount: 2,
    };

    // Action
    const getComment = new GetComment(payload);

    // Assert
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.date).toEqual(payload.date);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.replies).toEqual([]);
    expect(getComment.likeCount).toEqual(2);
  });
});
