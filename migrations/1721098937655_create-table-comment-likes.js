/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'comment_likes',
    'FK_comment_likes.comment_id_comments.id',
    'FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'comment_likes',
    'FK_comment_likes.owner_users.id',
    'FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('comment_likes', 'FK_comment_likes.owner_users.id');
  pgm.dropConstraint('comment_likes', 'FK_comment_likes.comment_id_comments.id');
  pgm.dropTable('comment_likes');
};
