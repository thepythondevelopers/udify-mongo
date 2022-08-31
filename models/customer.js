module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customers", {
      
      store_id: {
        allowNull: false,
        type: Sequelize.CHAR(32),
        allowNull: false,
      },
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },     
      accepts_marketing:{
        type: Sequelize.BOOLEAN()
      },
     email:{
        type: String
     },
    orders_count:{
        type: Sequelize.INTEGER()
    },
    total_spent:{
        type: Sequelize.INTEGER()
    },
    tax_exempt:{
        type: Sequelize.BOOLEAN(),
        defaultValue: 0
    },
    shopify_id:{
        type: String
    },
    company:{
        type: String
    },
    address_line1:{ 
        type: String
    },
    address_line2:{
        type: String
    },
    city:{
        type: String
    },
    province:{
        type: String
    },
    country:{
        type: String
    },
    zip:{
        type: String
    },
    phone:{
        type: String
    },
    province_code:{
        type: String
    },
    country_code:{
        type: String
    },
    country_name:{
        type: String
    },
    default:{
        type: Sequelize.BOOLEAN()
    },
    state:{
      type: String
  },
    sys_updated_at:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
    } 

    },{
      timestamps: false
  });
    return Customer;
  };