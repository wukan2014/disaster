matrix_file = open('matrix.csv', 'w', encoding='utf8')

def create_matrix(matrix):
	for word_i in aw:
		for word_j in aw:
			key = word_i + ',' + word_j
			matrix[key] = 0;
	return matrix

def add_to_matrix(matrix,json_terms):
	for word_i in json_terms:
		for word_j in json_terms:
			if word_i != word_j: 
				key = word_i + ',' + word_j
				matrix[key] = matrix[key]+1

def create_matrix_csv(matrix):
	csv_str = "term1,term2,count\n"
	for key in matrix:
		csv_str += key + "," + str(matrix[key]) + """\n"""
	return csv_str

matrix = {}
create_matrix(matrix)

#create for loop to run through articles and pass through json_terms (in the format [term1, term2, term3])
add_to_matrix(matrix,json_terms)

matrix_file.write(create_matrix_csv(matrix))
matrix_file.close()