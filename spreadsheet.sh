set -e

zip -rvFS spreadsheet.zip spreadsheet
aws lambda update-function-code  --function-name spreadsheet --zip-file fileb://spreadsheet.zip