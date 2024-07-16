class GetComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, date, username, is_delete, replies = [], likeCount = 0,
    } = payload;

    this.id = id;
    this.content = this._updateContent(is_delete, content);
    this.date = date;
    this.username = username;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload({
    id,
    content,
    date,
    username,
    is_delete,
    replies = [],
    likeCount = 0,
  }) {
    if (!id || !content || !date || !username || is_delete === undefined) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string'
        || typeof date !== 'string' || typeof username !== 'string'
        || typeof is_delete !== 'boolean' || !Array.isArray(replies)
        || typeof likeCount !== 'number') {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _updateContent(isDelete, content) {
    if (isDelete) return '**komentar telah dihapus**';
    return content;
  }
}

module.exports = GetComment;
