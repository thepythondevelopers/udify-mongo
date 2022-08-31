module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {

      store_id : {
        type: Sequelize.CHAR(32),
        allowNull: false,
    },
    body_html: {
        type: String
      },
      handle: {
        type: String
    },
    id :{
        type: String,
        allowNull: false,
    },
    images:{
        type: String
    },
    options:{
        type: String
    },
    product_type:{
        type: String
    },
    published_at:{        
        type: Sequelize.DATE,
    },
    published_scope:{
        type: String
    },
    tags:{
        type: String
    },
    template_suffix:{
        type: String
    },
    title:{
        type: String
    },
    metafields_global_title_tag:{
        type: String
    },
    metafields_global_description_tag:{
        type: String
    },
    vendor:{
        type: String
    },
    status:{
        type: String
    },
    sys_updated_at:{
        type: Date
    }
      
    },{
      timestamps: false,
  });
    return Product;
  };
