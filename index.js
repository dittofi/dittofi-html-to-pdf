process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
const wkhtmltopdf = require("./utils/wkhtmltopdf");
const errorUtil = require("./utils/error");

exports.handler = function handler(event, context, callback) {
    body = JSON.parse(event.body);
    const { html } = body;
    if (!html) {
        const errorResponse = errorUtil.createErrorResponse(400, `Validation error: Missing field 'html'.`);
        callback(errorResponse);
        return;
    }

    wkhtmltopdf(html)
        .then(buffer => {
            callback(null, {
                statusCode: 200,
                body: buffer.toString("base64"),
                isBase64Encoded: true,
                headers: {
                    "Content-Type": "application/pdf"
                }
            });
        }).catch(error => {
            callback(errorUtil.createErrorResponse(500, "Internal server error", error));
        });
};