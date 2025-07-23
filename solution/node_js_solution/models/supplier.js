import { DataTypes } from 'sequelize';
import { sequelize} from '../config.js';

export const Supplier = sequelize.define('Supplier', {
  name: { type: DataTypes.STRING, allowNull: false },
  contact_email: { type: DataTypes.STRING }
});
