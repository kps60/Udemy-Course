class HttpError extends Error {//HttpError extends with an buildin Error
    Constructor(massage, errorCode) {//passed 2 arguments
        super.massage;// to call construtor of the base class
        //in next step we add message property for HttpErrorclass
        this.code = errorCode;//adding code property
    }
}

export default HttpError;