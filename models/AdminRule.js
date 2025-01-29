const adminRuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }, // Rule details (e.g., "Max Capacity: 100")
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('AdminRule', adminRuleSchema);
  