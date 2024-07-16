const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const GetComment = require('../../Domains/comments/entities/GetComment');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const { content, owner, threadId } = createComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, date, owner, false, threadId],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async getComments(id) {
    const query = {
      text: `SELECT comments.id, comments.content, 
      comments.date, comments.is_delete, 
      users.username FROM comments
      LEFT JOIN users ON comments.owner = users.id 
      WHERE comments.thread_id = $1
      GROUP BY comments.id, users.username
      ORDER BY comments.date ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return [...result.rows.map((e) => new GetComment(e))];
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentOwner(checkOwner) {
    const { owner, commentId } = checkOwner;

    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    const comments = result.rows[0];

    if (comments.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses untuk resource ini');
    }
  }

  async checkCommentIsExist(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }
  }

  async checkIsLikesCommentExist(likesComment) {
    const { commentId, owner } = likesComment;
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async likesComment(likesComment) {
    const { commentId, owner } = likesComment;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async unlikesComment(unlikesComment) {
    const { commentId, owner } = unlikesComment;
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getCommentLikes(id) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM comment_likes WHERE comment_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0].count;
  }
}

module.exports = CommentRepositoryPostgres;
