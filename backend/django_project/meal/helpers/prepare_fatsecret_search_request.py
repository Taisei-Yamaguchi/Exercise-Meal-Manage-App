import hmac
import hashlib
import base64
import uuid
import os
import time
from urllib.parse import quote, urlencode


def prepare_fatsecret_search_request(search_expression):
    consumer_key = os.environ.get('FOOD_API_CONSUMER_KEY')
    consumer_secret = os.environ.get('FOOD_API_CONSUMER_SECRET')
    oauth_nonce = str(uuid.uuid4())
    oauth_timestamp = str(int(time.time()))
    url = 'https://platform.fatsecret.com/rest/server.api'
    
    encoded_search_expression = quote(search_expression, safe='')

    params = {
        'method': 'foods.search',
        'search_expression': encoded_search_expression,
        'max_results': 50,
        'format': 'json',
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_consumer_key': consumer_key,
        'oauth_nonce': oauth_nonce,
        'oauth_timestamp': oauth_timestamp,
        'oauth_version': '1.0',
    }

    signing_params = {k: v for k, v in params.items() if k != ''}
    base_string = '&'.join(['POST', quote(url, safe=''), quote(urlencode(sorted(signing_params.items())), safe='')])
    
    key = '{}&{}'.format(
        quote(consumer_secret, safe=''),  # client secret
        '',  # token secret, empty string for client credentials
    )
    
    signature = hmac.new(key.encode('utf-8'), base_string.encode('utf-8'), hashlib.sha1)
    oauth_signature = base64.b64encode(signature.digest()).decode('utf-8')

    params['oauth_signature'] = oauth_signature

    return url, params