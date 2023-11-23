def apply_search_expression(food, search_expression):

    # 検索文字列がAND条件かOR条件かを判定
    if '&' in search_expression:
        # AND条件の場合
        keywords = search_expression.split('&')
        match_all = all(keyword.lower() in food.get('food_name', '').lower() for keyword in keywords)
        return match_all
    elif '|' in search_expression:
        # OR条件の場合
        keywords = search_expression.split('|')
        match_any = any(keyword.lower() in food.get('food_name', '').lower() for keyword in keywords)
        return match_any
    else:
        # 単一条件の場合
        return search_expression.lower() in food.get('food_name', '').lower()
