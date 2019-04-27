FROM ubuntu:16.04

RUN apt-get update && \ 
    apt-get install -y ruby-dev lame sox libsndfile1-dev libsox-fmt-mp3 python-mutagen python3-mutagen && \
    gem install json-waveform -- --with-cflags=-Wno-error=format-security

COPY convert.sh /root/convert.sh

RUN chmod +x /root/convert.sh

CMD ["/root/convert.sh"]