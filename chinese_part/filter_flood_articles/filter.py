__author__ = 'Jingzhang'
import json
from Article import Article
from MyEncoder import MyEncoder
import codecs
import collections


articles = {}
flood_terms = []
generic_terms = []


def load_articles():
    reader = codecs.open('../data/result_CH_withEntity_2.0.txt', 'r', 'utf-8')
    for line in reader:
        obj = json.loads(line)

        if "publictime" in obj:
            title = obj["title"]
            time = obj["publictime"]
            content = obj["textcontent"]
            score, terms = cal_score_and_terms(content, title)
            #if score > 5:
                #print obj["id"], title
            content_pos = obj["seg_content_withStopList"]
            per_entities_tmp = obj["PER"][0][1:-1]
            per_entities = []
            if per_entities_tmp is not '':
                for i in per_entities_tmp.split(','):
                    x = i.strip()
                    if x not in per_entities and cmp(x, "") != 0:
                        per_entities.append(x)

            org_entities_tmp = obj["ORG"][0][1:-1]
            if org_entities_tmp is not '':
                for i in org_entities_tmp.split(',') :
                    x = i.strip()
                    if x not in per_entities and cmp(x, "") != 0:
                        per_entities.append(x)

            loc_entities_tmp = obj["LOC"][0][1:-1]
            loc_entities = []
            if loc_entities_tmp is not '':
                for i in loc_entities_tmp.split(','):
                    x = i.strip()
                    if x not in per_entities and cmp(x, "") != 0:
                        loc_entities.append(x)

            url = obj["url"]
            article = Article(title, content,time, content_pos,
                              per_entities, loc_entities, url, score, obj["id"], terms)         #title, content, time, content_pos, per_entities, loc_entities, url
            articles.setdefault(obj["id"], article)
    reader.close()
    print 'load articles finish,', len(articles)


def load_flood_terms():
    reader = codecs.open('../data/flooding-chinese-v2.0.txt', 'r', 'utf-8')
    for line in reader:
        term = line.strip()
        flood_terms.append(term)
    reader.close()


def load_generic_term():
    reader = codecs.open('../data/generic-disaster-dictionary.txt', 'r', 'utf-8')
    for line in reader:
        term = line.strip()
        generic_terms.append(term)
    reader.close()


def cal_score_and_terms(content, title):
    terms = collections.defaultdict(int)
    score = 0
    for i in flood_terms:
        if i in content:
            score += 2
            terms.setdefault(i, content.count(i))
        if i in title:
            score += 3
    for i in generic_terms:
        if i in content:
            score += 1
            terms.setdefault(i, content.count(i))
        if i in title:
            score += 2
    return score, terms


def convert_to_builtin_type(obj):
        d = {}
        d.setdefault('title', obj.title)
        d.setdefault('who', obj.who)
        d.setdefault('content', obj.content)
        d.setdefault('when', obj.when)
        d.setdefault('where', obj.where)
        d.setdefault('what', obj.what)
        d.setdefault('how', obj.how)
        d.setdefault('score', obj.score)
        d.setdefault('why', obj.why)
        return d

if __name__ == '__main__':
    load_flood_terms()
    load_generic_term()
    load_articles()
    sorted_article_list = sorted(articles.values(), key=lambda article: article.score, reverse=True)
    writer = codecs.open('../data/sorted_artiles.txt', 'w', 'utf-8')
    for i in sorted_article_list:
        writer.write(json.dumps(i,ensure_ascii=False, default=convert_to_builtin_type) + '\n')
    writer.close()
    print 'article size:', len(articles)