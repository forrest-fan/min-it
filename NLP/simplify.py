from process import process_input, complete_missing_word, get_bert_candidates
import numpy as np
import re
from wordfreq import zipf_frequency
from keras.models import load_model
from transformers import BertTokenizer, BertModel, BertForMaskedLM

list_texts = [
     'The Risk That Students Could Arrive at School With the Coronavirus As schools grapple with how to reopen, new estimates show that large parts of the country would probably see infected students if classrooms opened now.',
     'How a photograph of a young man cradling his dying friend sent me on a journey across India.',
     'Pro-democracy parties, which had hoped to ride widespread discontent to big gains, saw the yearlong delay as an attempt to thwart them.',
     'Night after night, calm gave way to chaos. See what happened between the protesters and the federal agents.',
     'Contact Tracing Is Failing in Many States. Here is Why. Inadequate testing and protracted delays in producing results have crippled tracking and hampered efforts to contain major outbreaks.',
     'After an initial decrease in the youth detention population, the rate of release has slowed, and the gap between white youth and Black youth has grown.'
     'A laboratory experiment hints at some of the ways the virus might elude antibody treatments. Combining therapies could help, experts said.',
     'Though I may not be here with you, I urge you to answer the highest calling of your heart and stand up for what you truly believe.',
     'The research does not prove that infected children are contagious, but it should influence the debate about reopening schools, some experts said.',
     'Dropping antibody counts are not a sign that our immune system is failing against the coronavirus, nor an omen that we can not develop a viable vaccine.',
     'The Senate majority leader has said he will not approve a stimulus package without a “liability shield,” but top White House officials say they do not see it as essential.',
     'Campaign efforts to refocus come as the president continues to push divisive messages that have frustrated his own party.'
    ]

def simplify(list_texts):
    model_cwi = load_model("lexical.h5")

    for input_text in list_texts:
      new_text = input_text
      input_padded, index_list, len_list = process_input(input_text)
      pred_cwi = model_cwi.predict(input_padded)
      pred_cwi_binary = np.argmax(pred_cwi, axis = 2)
      complete_cwi_predictions = complete_missing_word(pred_cwi_binary, index_list, len_list)
      bert_candidates =   get_bert_candidates(input_text, complete_cwi_predictions)
      for word_to_replace, l_candidates in bert_candidates:
        tuples_word_zipf = []
        for w in l_candidates:
          if w.isalpha():
            tuples_word_zipf.append((w, zipf_frequency(w, 'en')))
        tuples_word_zipf = sorted(tuples_word_zipf, key = lambda x: x[1], reverse=True)
        new_text = re.sub(word_to_replace, tuples_word_zipf[0][0], new_text)
      return new_text

# simplify(list_texts)