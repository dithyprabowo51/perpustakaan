'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Book extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Book.belongsToMany(models.Member, { through: 'BorrowedBook' })
		}
	};
	Book.init({
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'book cannot be empty' },
				notEmpty: { msg: 'book cannot be empty' }
			}
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'title cannot be empty' },
				notEmpty: { msg: 'title cannot be empty' }
			}
		},
		author: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'author cannot be empty' },
				notEmpty: { msg: 'author cannot be empty' }
			}
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: { msg: 'stock cannot be empty' },
				notEmpty: { msg: 'stock cannot be empty' }
			}
		},
		available_quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notNull: { msg: 'available quantity cannot be empty' },
				notEmpty: { msg: 'available quantity cannot be empty' }
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
		modelName: 'Book',
		tableName: 'Books',
		timestamps: false
	});
	return Book;
};