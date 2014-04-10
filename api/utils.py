from django.db.models import Q
import operator 


def search_fields(queryset, search_terms, fields):
    """Searches fields for search_terms.

    Given a queryset to filter, takes a series of fields and search terms and
    checks that each search term is found in at least one of the given fields.
    Returns: 
        A queryset filtered by the search_terms. 
    """
    and_queries = []
    for search_term in search_terms:
        queries = []
        for field in fields:
            queries.append(Q(**{field: search_term}))
        query = reduce(operator.or_, queries)
        and_queries.append(query)
    queryset = queryset.filter(reduce(operator.and_, and_queries))
    return queryset