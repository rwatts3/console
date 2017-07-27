set -x
set -e
git clone https://github.com/facebook/watchman.git
cd watchman
sudo apt-get update; sudo apt-get install -y autoconf automake build-essential python-dev pkg-config
./autogen.sh
./configure
make
sudo make install
