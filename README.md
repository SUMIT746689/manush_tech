<h1 align="center">
    <b>School Management System SasS</b>
    <br>
    
</h1>

<!-- docker build command -->

<!-- create docker image -->
sudo docker build --no-cache --progress plain -t ridoy235/elitbuzz:school_admin_v1 --network=host -f MehediDockerfile .

<!-- build container -->
docker run -d --name school_admin_v1 -p  3000:3000 ridoy235/elitbuzz:school_admin_v1