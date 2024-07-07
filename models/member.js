'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Member extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Member.belongsToMany(models.Book, { through: 'BorrowedBook', as: 'BorrowedBooks' })
			Member.hasMany(models.MemberPenalty, { foreignKey: 'MemberId' })
		}
	};
	Member.init({
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'book cannot be empty' },
				notEmpty: { msg: 'book cannot be empty' }
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: 'name cannot be empty' },
				notEmpty: { msg: 'name cannot be empty' }
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
		modelName: 'Member',
		tableName: 'Members',
		timestamps: false
	});
	return Member;
};