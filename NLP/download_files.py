import wget
import zipfile

wget.download("https://www.inf.uni-hamburg.de/en/inst/ab/lt/resources/data/complex-word-identification-dataset/cwishareddataset.zip")
with zipfile.ZipFile("cwishareddataset.zip", 'r') as zip_ref:
    zip_ref.extractall("./")

wget.download("http://nlp.stanford.edu/data/glove.6B.zip")

with zipfile.ZipFile("cwishareddataset.zip", 'r') as zip_ref:
    zip_ref.extractall("./embeddings")