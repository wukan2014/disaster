__author__ = 'Jingzhang'


class Article:
    def __init__(self, title, content, time, content_pos, per_entities, loc_entities, url, score, id, terms):
        self.title = title
        self.content = content
        self.when = time
        self.content_pos = content_pos
        self.why = url
        self.what = 'Flood'          # terms of the flood and its count
        self.how = []           # sentences of people be affected.
        self.where = loc_entities
        self.who = per_entities
        self.score = score
        self.id = id
        self.terms = terms




