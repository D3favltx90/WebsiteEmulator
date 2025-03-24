# Use an official Nginx runtime as a parent image
FROM nginx:latest

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy default Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

## EchoTeck Setup
# Copy the website content to the Nginx document root
RUN mkdir -p /usr/share/nginx/echoteck
COPY EchoTeck/src /usr/share/nginx/echoteck

# Copy a custom Nginx configuration
RUN mkdir -p /etc/nginx/sites-available/
RUN mkdir -p /etc/nginx/sites-enabled/
COPY EchoTeck/nginx/sites-available/echoteck.net.conf /etc/nginx/sites-available/echoteck.net.conf
RUN ln -s /etc/nginx/sites-available/echoteck.net.conf /etc/nginx/sites-enabled/

## DripMart Setup
# Copy the website content to the Nginx document root
RUN mkdir -p /usr/share/nginx/dripmart
COPY DripMart/src /usr/share/nginx/dripmart

# Copy a custom Nginx configuration
RUN mkdir -p /etc/nginx/sites-available/
RUN mkdir -p /etc/nginx/sites-enabled/
COPY DripMart/nginx/sites-available/dripmart.org.conf /etc/nginx/sites-available/dripmart.org.conf
RUN ln -s /etc/nginx/sites-available/dripmart.org.conf /etc/nginx/sites-enabled/

## VidStreamerz Setup
# Copy the website content to the Nginx document root
RUN mkdir -p /usr/share/nginx/vidstreamerz
COPY VidStreamerz/src /usr/share/nginx/vidstreamerz

# Copy a custom Nginx configuration
RUN mkdir -p /etc/nginx/sites-available/
RUN mkdir -p /etc/nginx/sites-enabled/
COPY VidStreamerz/nginx/sites-available/vidstreamerz.com.conf /etc/nginx/sites-available/vidstreamerz.com.conf
RUN ln -s /etc/nginx/sites-available/vidstreamerz.com.conf /etc/nginx/sites-enabled/

# Expose port 80 to the outside world
EXPOSE 80

# Nginx starts automatically when the container runs, so no CMD is needed