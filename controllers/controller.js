'use strict';

class Controller {
  constructor() {
    
  }

  sendError(err, res) {
    const json = this.errorResponse(err);
    res.json(json);
  }

  sendSuccess(data, res) {
    const json = this.successResponse(data);
    res.json(json);
  }

  successResponse(data) {
    if (!data) {
      return {
	success: true
      };
    }
    return {
      success: true,
      data
    };
  }

  errorResponse(err) {
    if (!err.toJSON) {
      console.log('BUG: ');
      console.log(err);
      process.exit(0);
    }
    return {
      success: false,
      error: err.toJSON()
    };
  }
}

module.exports = Controller;
