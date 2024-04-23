<h1 align="center">
    <b>School Management System SaaS</b>
    <br>
    
</h1>

<!-- docker build command -->

<!-- create docker image -->
sudo docker build --no-cache --progress plain -t ridoy235/elitbuzz:school_admin_v1 --network=host -f MehediDockerfile .

<!-- build container -->
docker run -d --name school_admin_v1 -p  3000:3000 ridoy235/elitbuzz:school_admin_v1

<!-- create docker image with cache  -->
sudo docker build --progress plain -t ridoy235/elitbuzz:school_admin_v8 --network=host -f MehediDockerfile .
