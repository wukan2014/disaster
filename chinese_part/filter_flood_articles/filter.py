# -*- coding: utf-8 -*-
__author__ = 'Jingzhang'
import json
from Article import Article
import codecs
import collections
import re

articles = {}
flood_terms = []
generic_terms = []
aw = []
matrix = {}


def load_articles():
    reader = codecs.open('../data/result_CH_withEntity_2.0.txt', 'r', 'utf-8')
    for line in reader:
        obj = json.loads(line)

        if "publictime" in obj:
            title = obj["title"]
            time = obj["publictime"]
            content = obj["textcontent"]
            score, terms = cal_score_and_terms(content, title)
            content_pos = obj["seg_content_withStopList"]
            per_entities_tmp = obj["PER"][0][1:-1]
            per_entities = "";
            if per_entities_tmp is not '':
                for i in per_entities_tmp.split(','):
                    x = i.strip()
                    if x not in per_entities and cmp(x, "") != 0:
                        per_entities += '\'' + x + '\','

            org_entities_tmp = obj["ORG"][0][1:-1]
            if org_entities_tmp is not '':
                for i in org_entities_tmp.split(',') :
                    x = i.strip()
                    if x not in per_entities and cmp(x, "") != 0:
                        per_entities += '\'' + x + '\','

            loc_entities_tmp = obj["LOC"][0][1:-1]
            loc_entities = ""
            if loc_entities_tmp is not '':
                for i in loc_entities_tmp.split(','):
                    x = i.strip()
                    if x not in per_entities and cmp(x, "") != 0:
                        loc_entities += '\'' + x + '\','

            url = obj["url"]
            article = Article(title, content,time, content_pos,
                              per_entities, loc_entities, url, score, obj["id"], terms)         #title, content, time, content_pos, per_entities, loc_entities, url

            #commented out as method doesn't exist in file on github
            #article.set_how(get_person_count_sentence_list(content))

            articles.setdefault(obj["id"], article)
    reader.close()
    print 'load articles finish,', len(articles)


def get_person_count_sentence_list(content):
    result = []
    split_contents = re.split(u'[。?;\n\t；！：]', content)
    for l in split_contents:
        # print l
        m = re.search(u'\d+人|\d+万人', l)
        if m:
            n = re.search(u'死亡|失踪|受灾|身亡|受伤', l)
            if n:
                result .append(l.strip())
    return result


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
    all_content = content + title
    for i in flood_terms:
        if i in all_content:
            score += 2
            terms.setdefault(i, all_content.count(i))
            if i in title:
                score += 1
    for i in generic_terms:
        if i in all_content:
            score += 1
            terms.setdefault(i, all_content.count(i))
            if i in title:
                score += 1
    return score, terms


def convert_to_builtin_type(obj):
        d = {}
        #d.setdefault('title', obj.title)
        d.setdefault('who', obj.who)
        #d.setdefault('content', obj.content)
        d.setdefault('when', obj.when)
        d.setdefault('where', obj.where)
        d.setdefault('what', obj.what)
        d.setdefault('how', obj.how)
        #d.setdefault('score', obj.score)
        d.setdefault('why', obj.why)
        d.setdefault('terms', obj.terms)
        d.setdefault('how', obj.how)
        return d


def create_article_json(article_id, url, pub_date, title, linked_articles, location, how, terms, counts):
    article_json = json.dumps(
        {
            'id' 				: article_id,   #article id
            'url' 				: url,      #article url
            'publication_date' 	: pub_date, #publication date
            'title' 			: title,    #article title
            'linked_articles' 	: '',        #empty
            'who' 	: '',           #string of organisations
            'what' 	: 'flood',      #flood
            'why'	: url,          #article url
            'when'	: pub_date,     #publication date
            'where'	: location,     #location information (place names)
            'how'	: how,          #string of how
            'terms'	: terms,        #{disaster, rain}
            'counts': counts        #{disaster: 3, rain: 4}
        },
        ensure_ascii=False)
    return article_json


def create_matrix(matrix):
    for word_i in aw:
        for word_j in aw:
            key = word_i + ',' + word_j
            matrix.setdefault(key, 0)
    return matrix


def add_to_matrix(matrix,json_terms):
    for word_i in json_terms:
        for word_j in json_terms:
            if word_i != word_j:
                key = word_i + ',' + word_j
                matrix[key] += 1


def create_matrix_csv(matrix):
    csv_str = "term1,term2,co-occurence\n"
    for key in matrix:
        csv_str += key + "," + str(matrix[key]) + "\n"
    return csv_str

def create_donut_csv(terms):
    csv_counts = "term,count\n"

    for key in terms:
        csv_counts += key + "," + str(terms[key])

    return csv_counts

if __name__ == '__main__':
    load_flood_terms()
    load_generic_term()
    aw = flood_terms
    aw.extend(generic_terms)
    load_articles()

    # sorted by score and get most related articles
    sorted_article_list = sorted(articles.values(), key=lambda article: article.score, reverse=True)[0:3000]
    print len(sorted_article_list), type(sorted_article_list)
    writer = codecs.open('../data/sorted_articles.json', 'w', 'utf-8')
    for article in sorted_article_list:
        # article_id, url, pub_date,title,linked_articles,location,how,terms,counts
        writer.write(create_article_json(article.id, article.why, article.when, article.title,
                                         '', article.where, article.how, article.terms.keys(), create_donut_csv(article.terms)) + ',\n')
    writer.close()
    print 'article size:', len(articles)

    # create matrix to viz
    matrix_file = codecs.open('../data/matrix.csv', 'w', 'utf8')
    create_matrix(matrix)
    print len(aw), len(matrix)
    for article in sorted_article_list:
        words = article.terms.keys()
        add_to_matrix(matrix, words)
    matrix_file.write(create_matrix_csv(matrix))
    matrix_file.close()
