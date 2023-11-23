def clean_search_expression(search_expression):
    # スペースを取り除く
    cleaned_expression = search_expression.replace(" ", "").lower()
    # 末尾の/を取り除く
    cleaned_expression = cleaned_expression.rstrip('/')
    return cleaned_expression
