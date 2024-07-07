'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BorrowedBook extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			BorrowedBook.belongsTo(models.Book, { foreignKey: 'BookId' })
			BorrowedBook.belongsTo(models.Member, { foreignKey: 'MemberId' })
		}
	};
	BorrowedBook.init({
		BookId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: { msg: 'book id cannot be empty' },
				notEmpty: { msg: 'book id cannot be empty' }
			}
		},
		MemberId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: { msg: 'member id cannot be empty' },
				notEmpty: { msg: 'member id cannot be empty' }
			}
		},
		created_at: {
			type: DataTypes.BIGINT
		},
		updated_at: {
			type: DataTypes.BIGINT
		},
	}, {
		hooks: {
			beforeCreate: record => {
				const now = new Date().getTime()
				record.dataValues.created_at = now
				record.dataValues.updated_at = now
			},
			beforeUpdate: record => {
				const now = new Date().getTime()
				record.dataValues.updated_at = now
			},
		},
		sequelize,
		modelName: 'BorrowedBook',
		tableName: 'BorrowedBooks',
		timestamps: false
	});
	return BorrowedBook;
};