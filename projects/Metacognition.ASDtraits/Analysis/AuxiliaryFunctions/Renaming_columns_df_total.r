root <- rprojroot::is_rstudio_project
basename(getwd())               

# load dataframe 
filepath <- root$find_file("Data/df_total.Rda")
load(file= filepath)


colnames(df_total) <- c('Participant',
                  'SleepHours',
                  'birthday',
                  "Country",
                  "gender",
                  "StudyLevel",
                  "PsychiatricDiagnosis",
                  "PsychotropicMedication",
                  "Browser",
                  "RelyOn",
                  "Problems",
                  "AQ_test",
                  "AQ_social",
                  "AQ_AttentionSwitch",
                  "AQ_AttentionDetail",
                  "AQ_communication",
                  "AQ_imagination",
                  "PC",
                  "age",
                  "ConfKey1",
                  "ConfKey2",
                  "ConfKey3",
                  "ConfKey4",
                  "ConfMean",
                  "ConfStanDev",
                  "DiscReacTimeMean",
                  "DiscReacTimeStanDev",
                  "ConfReacTimeMean",
                  "ConfReacTimeStanDev",
                  "discrimination_is_correct",
                  "confidence_key",
                  "trial",
                  "Diff_dots",
                  "TimeDiscTrial",
                  "TimeConfTrial")

library(dplyr)

df_total <- df_total %>%
  select('Participant',
         'birthday',
         "Country",
         "gender",
         "PsychiatricDiagnosis",
         "PsychotropicMedication",
         "RelyOn",
         "Problems",
         "AQ_test",
         "AQ_social",
         "AQ_AttentionSwitch",
         "AQ_AttentionDetail",
         "AQ_communication",
         "AQ_imagination",
         "PC",
         "age",
         "ConfKey1",
         "ConfKey2",
         "ConfKey3",
         "ConfKey4",
         "ConfMean",
         "discrimination_is_correct",
         "confidence_key",
         "trial",
         "TimeDiscTrial",
         "TimeConfTrial")

### Save the df_total, now df_total_filtered
filepath <- root$find_file("Data/df_total.Rda")
save(df_total,file = filepath)
